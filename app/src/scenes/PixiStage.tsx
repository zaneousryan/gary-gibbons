// PixiStage — the world layer (tech spec §7). Phase 0 scope: parallax layers,
// point-to-walk Gary on the walk-line, hotspot markers with proximity
// highlight, talk routing through the scheduler, exits. Phase 1 completes
// actors, tab-cycling, tint LUTs, and rain particles.

import { useEffect, useRef } from 'react';
import { Application, Container, Graphics, Sprite, Text, TextStyle, type Texture } from 'pixi.js';
import type { ContentDB } from '@content/contentDb';
import type { Hotspot, LocationDef } from '@content/schemas/location';
import { evalCondition, type Condition } from '@engine/conditions';
import type { Effect } from '@engine/effects';
import { useGameStore } from '@engine/store';
import { useDialogueStore, selectDialogueFor } from '@systems/dialogue';
import { actorsAt } from '@systems/schedule';
import { greetingFor } from '@systems/trust';
import { voxPopLineFor } from '@systems/morningPages';
import { usePuzzleStore } from '@systems/puzzles';
import { useUiStore } from '@ui/uiStore';
import { loadTexture, locationLayerPath, spritePath } from './assets';

const DESIGN_W = 1920;
const DESIGN_H = 1080;
const WALK_SPEED = 520; // px/sec along the walk line

/** Day-phase tint LUT-lite (spec §7): whole-world multiply per phase. */
const PHASE_TINT: Record<string, number> = {
  morning: 0xfff2dc,
  midday: 0xffffff,
  evening: 0xf2b878,
  night: 0x7d94a8,
};

interface NpcView {
  sprite: Sprite;
  idle: Texture[];
  talk: Texture[];
}

interface SceneRefs {
  app: Application;
  world: Container;
  gary: Sprite | null;
  garyTarget: number | null;
  hotspotViews: { hotspot: Hotspot; marker: Graphics; label: Text; x: number; y: number }[];
  focusIndex: number; // keyboard tab-cycle (accessibility floor, ALETHEIA §7)
  npcs: Map<string, NpcView>;
  sitSpot: { x: number; y: number; marker: Graphics } | null;
  animClock: number;
  pendingInteract: (() => void) | null;
  location: LocationDef | null;
}

async function buildScene(db: ContentDB, refs: SceneRefs, locationId: string) {
  const { world } = refs;
  // reset refs BEFORE destroying children — the ticker runs during the async
  // build and must never touch a destroyed display object
  refs.gary = null;
  refs.location = null;
  refs.hotspotViews = [];
  refs.npcs = new Map();
  refs.sitSpot = null;
  refs.focusIndex = -1;
  refs.garyTarget = null;
  refs.pendingInteract = null;
  world.removeChildren().forEach((c) => c.destroy({ children: true }));

  const state = useGameStore.getState().state;
  const loc = db.locations[locationId];
  if (!loc) return;
  refs.location = loc;
  world.tint = PHASE_TINT[state.phase] ?? 0xffffff;

  // parallax layers, back to front — rain variants swap in when the location
  // has them (II.14.2)
  const rainy = state.weather === 'rain' && loc.ambient?.weatherVariants;
  for (const layer of loc.layers) {
    const tex = await loadTexture(
      rainy ? `locations/${loc.id}/rain_${layer}.png` : locationLayerPath(loc.id, state.phase, layer),
    );
    if (tex) {
      const sprite = new Sprite(tex);
      sprite.width = DESIGN_W * (layer === 'bg' ? 1 : 1.05);
      sprite.height = DESIGN_H;
      sprite.label = `layer_${layer}`;
      world.addChild(sprite);
    }
    if (layer === 'mid') {
      // actors live between mid and fg
      const actorLayer = new Container();
      actorLayer.label = 'actors';
      world.addChild(actorLayer);
    }
  }
  const actorLayer = (world.getChildByLabel('actors') as Container) ?? world;

  // scheduled NPCs (with 2-frame idle/talk cycles, spec §7)
  let spreadIndex = 0;
  for (const placement of actorsAt(db, state, loc.id)) {
    const ch = db.characters[placement.characterId];
    if (!ch) continue;
    const [idle1, idle2, talk1, talk2] = await Promise.all(
      ['idle_1', 'idle_2', 'talk_1', 'talk_2'].map((p) => loadTexture(spritePath(ch.portraitSet, p))),
    );
    if (!idle1) continue;
    const npc = new Sprite(idle1);
    npc.anchor.set(0.5, 1);
    npc.height = 360;
    npc.scale.x = npc.scale.y;
    // stand them near their talk hotspot if one exists, else spread along the line
    const talkSpot = loc.hotspots.find((h) => h.kind === 'talk' && h.character === ch.id);
    const x = talkSpot?.at?.[0] ?? loc.walkLine.minX + 260 + 220 * spreadIndex++;
    npc.position.set(x, loc.walkLine.y);
    npc.label = `npc_${ch.id}`;
    actorLayer.addChild(npc);
    refs.npcs.set(ch.id, {
      sprite: npc,
      idle: [idle1, idle2 ?? idle1],
      talk: [talk1 ?? idle1, talk2 ?? talk1 ?? idle1],
    });
  }

  // Gary
  const garyDef = db.characters['gary'];
  const garyTex = garyDef ? await loadTexture(spritePath(garyDef.portraitSet, 'idle_1')) : null;
  if (garyTex) {
    const gary = new Sprite(garyTex);
    gary.anchor.set(0.5, 1);
    gary.height = 380;
    gary.scale.x = gary.scale.y;
    gary.position.set(
      Math.min(Math.max(DESIGN_W / 2, loc.walkLine.minX), loc.walkLine.maxX),
      loc.walkLine.y,
    );
    gary.label = 'gary';
    actorLayer.addChild(gary);
    refs.gary = gary;
  }

  // hotspot markers
  const labelStyle = new TextStyle({
    fontFamily: 'Georgia',
    fontSize: 26,
    fill: 0xf4ead3,
    stroke: { color: 0x2c2620, width: 4 },
  });
  for (const hotspot of loc.hotspots) {
    if (!evalCondition((hotspot.cond ?? {}) as Condition, state)) continue;
    const [hx, hy] = hotspot.at ?? centroid(hotspot.poly!);
    const marker = new Graphics().circle(0, 0, 14).fill(0xe8a34c).stroke({ color: 0x2c2620, width: 3 });
    marker.position.set(hx, hy);
    marker.eventMode = 'static';
    marker.cursor = 'pointer';
    const label = new Text({ text: hotspot.label ?? hotspot.id, style: labelStyle });
    label.anchor.set(0.5, 1);
    label.position.set(hx, hy - 24);
    label.visible = false;
    world.addChild(marker, label);
    refs.hotspotViews.push({ hotspot, marker, label, x: hx, y: hy });
  }

  // rain particle layer (spec §7)
  if (state.weather === 'rain') {
    const rain = new Graphics();
    rain.label = 'rain';
    for (let i = 0; i < 220; i++) {
      const x = (i * 173) % DESIGN_W;
      const y = (i * 389) % DESIGN_H;
      rain.rect(x, y, 2, 16).fill({ color: 0x9fc2c9, alpha: 0.5 });
    }
    world.addChild(rain);
  }

  // sit spot — Bench Time (II.18)
  if (loc.sitSpot) {
    const [sx, sy] = loc.sitSpot.at;
    const marker = new Graphics().roundRect(-26, -12, 52, 24, 6).fill(0x33605d).stroke({ color: 0x2c2620, width: 3 });
    marker.position.set(sx, sy - 6);
    marker.eventMode = 'static';
    marker.cursor = 'pointer';
    world.addChild(marker);
    refs.sitSpot = { x: sx, y: sy, marker };
  }
}

/** Sit down: play the first passing bench monologue (II.18). */
function sitDown(loc: LocationDef) {
  const state = useGameStore.getState().state;
  const pick = loc.sitSpot?.monologues.find((m) => evalCondition((m.cond ?? {}) as Condition, state));
  if (pick) useGameStore.getState().runEffects([{ playBark: pick.bark }]);
}

function centroid(poly: [number, number][]): [number, number] {
  const x = poly.reduce((a, p) => a + p[0], 0) / poly.length;
  const y = poly.reduce((a, p) => a + p[1], 0) / poly.length;
  return [x, y];
}

function interact(db: ContentDB, hotspot: Hotspot) {
  const game = useGameStore.getState();
  const state = game.state;
  const ui = useUiStore.getState();

  switch (hotspot.kind) {
    case 'exit':
      if (hotspot.to) game.moveTo(hotspot.to);
      return;
    case 'talk': {
      if (!hotspot.character) return;
      const ch = db.characters[hotspot.character];
      const greeting = greetingFor(db, hotspot.character);
      const dlgId = selectDialogueFor(db, hotspot.character);
      if (dlgId) {
        if (greeting && ch) ui.showGreeting({ name: ch.name, text: greeting });
        useDialogueStore.getState().start(db, dlgId);
      } else {
        // vox pop (II.15.5): the ambient crowd becomes sources
        const vox = voxPopLineFor(db, hotspot.character);
        if (vox && ch) {
          ui.setExamine({ title: `${ch.name} — vox pop`, text: `“${vox}”` });
        } else if (greeting && ch) {
          ui.showGreeting({ name: ch.name, text: greeting });
        } else {
          ui.showToast(`${ch?.name ?? hotspot.character} has nothing new right now.`);
        }
      }
      return;
    }
    case 'chekhov': {
      const detail = hotspot.detail;
      if (!detail) return;
      if (!evalCondition((detail.cond ?? {}) as Condition, state)) return;
      if (detail.text) ui.setExamine({ title: hotspot.label ?? hotspot.id, text: detail.text });
      const effects: Effect[] = [];
      if (detail.card) effects.push({ giveCard: detail.card });
      if (detail.question) effects.push({ notebook: { question: detail.question } });
      if (detail.flag) effects.push({ setFlag: detail.flag });
      if (effects.length) game.runEffects(effects);
      return;
    }
    case 'examine':
    case 'puzzle':
    case 'photo': {
      for (const it of hotspot.interactions) {
        if (!evalCondition((it.cond ?? {}) as Condition, state)) continue;
        if (it.once && state.flags[`done_${hotspot.id}_${it.id}`]) continue;
        if (it.oncePerDay && state.flags[`done_${hotspot.id}_${it.id}_d${state.day}`]) continue;
        if (it.text) ui.setExamine({ title: hotspot.label ?? hotspot.id, text: it.text });
        if (it.opens) {
          const puzzleId = it.opens.startsWith('puzzle:') ? it.opens.slice('puzzle:'.length) : it.opens;
          usePuzzleStore.getState().open(puzzleId);
        }
        const effects: Effect[] = [...(it.effects ?? [])] as Effect[];
        if (it.once) effects.push({ setFlag: `done_${hotspot.id}_${it.id}` });
        if (it.oncePerDay) effects.push({ setFlag: `done_${hotspot.id}_${it.id}_d${state.day}` });
        if (effects.length) game.runEffects(effects);
        return; // first passing interaction wins
      }
      return;
    }
  }
}

export default function PixiStage({ db }: { db: ContentDB }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current!;
    const refs: SceneRefs = {
      app: new Application(),
      world: new Container(),
      gary: null,
      garyTarget: null,
      hotspotViews: [],
      focusIndex: -1,
      npcs: new Map(),
      sitSpot: null,
      animClock: 0,
      pendingInteract: null,
      location: null,
    };
    let destroyed = false;
    let unsubLocation: (() => void) | null = null;
    let unsubPhase: (() => void) | null = null;
    let cleanupKeys: (() => void) | null = null;

    (async () => {
      await refs.app.init({
        width: DESIGN_W,
        height: DESIGN_H,
        background: 0x2c2620,
        antialias: true,
      });
      if (destroyed) {
        refs.app.destroy(true);
        return;
      }
      host.appendChild(refs.app.canvas);
      refs.app.canvas.style.width = '100%';
      refs.app.canvas.style.height = '100%';
      refs.app.canvas.style.objectFit = 'contain';
      refs.app.stage.addChild(refs.world);

      // point-to-walk: clicking empty scene walks; clicking a hotspot walks then interacts
      refs.app.stage.eventMode = 'static';
      refs.app.stage.hitArea = { contains: () => true };
      const walkTo = (x: number, act: (() => void) | null) => {
        const loc = refs.location;
        if (!loc || !refs.gary) return;
        refs.garyTarget = Math.min(Math.max(x, loc.walkLine.minX), loc.walkLine.maxX);
        refs.pendingInteract = act;
      };

      refs.app.stage.on('pointertap', (e) => {
        if (useDialogueStore.getState().view) return; // conversation holds the floor
        const loc = refs.location;
        if (!loc || !refs.gary) return;
        const point = refs.world.toLocal(e.global);
        const hs = refs.hotspotViews.find((h) => Math.hypot(h.x - point.x, h.y - point.y) < 60);
        if (hs) {
          walkTo(hs.x, () => interact(db, hs.hotspot));
        } else if (refs.sitSpot && Math.hypot(refs.sitSpot.x - point.x, refs.sitSpot.y - point.y) < 60) {
          const sit = refs.sitSpot;
          walkTo(sit.x, () => sitDown(loc));
        } else {
          walkTo(point.x, null);
        }
      });

      // keyboard: Tab cycles hotspots, Enter interacts (accessibility floor, spec §7)
      const onKey = (e: KeyboardEvent) => {
        if (useDialogueStore.getState().view) return;
        if (e.key === 'Tab') {
          e.preventDefault();
          if (refs.hotspotViews.length === 0) return;
          refs.focusIndex = (refs.focusIndex + 1) % refs.hotspotViews.length;
        } else if (e.key === 'Enter' && refs.focusIndex >= 0) {
          const h = refs.hotspotViews[refs.focusIndex];
          if (h) walkTo(h.x, () => interact(db, h.hotspot));
        }
      };
      window.addEventListener('keydown', onKey);
      cleanupKeys = () => window.removeEventListener('keydown', onKey);

      refs.app.ticker.add((ticker) => {
        const gary = refs.gary;
        const loc = refs.location;
        if (!gary || !loc) return;
        // walk
        if (refs.garyTarget !== null) {
          const dx = refs.garyTarget - gary.x;
          const step = WALK_SPEED * (ticker.deltaMS / 1000);
          if (Math.abs(dx) <= step) {
            gary.x = refs.garyTarget;
            refs.garyTarget = null;
            const act = refs.pendingInteract;
            refs.pendingInteract = null;
            if (act) {
              act();
              return; // the interaction may have rebuilt the scene — this frame's refs are stale
            }
          } else {
            gary.x += Math.sign(dx) * step;
            gary.scale.x = Math.abs(gary.scale.x) * (dx < 0 ? -1 : 1);
          }
        }
        // depth scaling along the walk line
        const [minS, maxS] = loc.walkLine.depthScale ?? [1, 1];
        const t = (gary.x - loc.walkLine.minX) / (loc.walkLine.maxX - loc.walkLine.minX);
        const s = minS + (maxS - minS) * Math.min(Math.max(t, 0), 1);
        const base = 380 / (refs.gary?.texture.height ?? 380);
        gary.scale.set(Math.sign(gary.scale.x) * base * s, base * s);
        // proximity + keyboard-focus highlight
        refs.hotspotViews.forEach((h, i) => {
          const near = Math.hypot(h.x - gary.x, h.y - loc.walkLine.y) < 420;
          const focused = i === refs.focusIndex;
          h.label.visible = near || focused;
          h.marker.alpha = focused ? 1 : near ? 1 : 0.55;
          h.marker.scale.set(focused ? 1.35 : 1);
        });
        // rain falls
        const rain = refs.world.getChildByLabel('rain');
        if (rain) {
          rain.y = (rain.y + ticker.deltaMS * 0.55) % 32;
        }
        // 2-frame talk/idle cycles
        refs.animClock += ticker.deltaMS;
        const frame = Math.floor(refs.animClock / 260) % 2;
        const speaking = useDialogueStore.getState().view?.speaker;
        for (const [charId, npc] of refs.npcs) {
          const set = charId === speaking ? npc.talk : npc.idle;
          const tex = set[frame];
          if (tex && npc.sprite.texture !== tex) npc.sprite.texture = tex;
        }
      });

      const rebuild = () => {
        host.removeAttribute('data-scene-ready');
        void buildScene(db, refs, useGameStore.getState().state.location).then(() => {
          host.setAttribute('data-scene-ready', useGameStore.getState().state.location);
        });
      };
      rebuild();
      let lastLocation = useGameStore.getState().state.location;
      let lastPhase = useGameStore.getState().state.phase;
      let lastWeather = useGameStore.getState().state.weather;
      unsubLocation = useGameStore.subscribe((s) => {
        if (s.state.location !== lastLocation || s.state.phase !== lastPhase || s.state.weather !== lastWeather) {
          lastLocation = s.state.location;
          lastPhase = s.state.phase;
          lastWeather = s.state.weather;
          rebuild();
        }
      });
      unsubPhase = null;
    })();

    return () => {
      destroyed = true;
      unsubLocation?.();
      unsubPhase?.();
      cleanupKeys?.();
      if (refs.app.renderer) refs.app.destroy(true);
      host.replaceChildren();
    };
  }, [db]);

  return <div ref={hostRef} className="absolute inset-0" data-testid="pixi-stage" />;
}
