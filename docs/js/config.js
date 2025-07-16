// js/config.js

// --- Canvas & Layout ---
export const FULLSCREEN = true;
export const DESIGN_WIDTH = 1200;
export const DESIGN_HEIGHT = 800;

// --- Platform & Obstacles ---
export const PLATFORM_WIDTH_FRAC = 250 / DESIGN_WIDTH;
export const PLATFORM_HEIGHT_FRAC = 10 / DESIGN_HEIGHT;
export const PLATFORM_EDGE_TOLERANCE = 5;

export const OBSTACLE_WIDTH_FRAC = 40 / DESIGN_WIDTH;
export const COIN_WIDTH_FRAC = 30 / DESIGN_WIDTH;
export const SQUARE_WIDTH_FRAC = 30 / DESIGN_WIDTH;

// --- Spikes ---
export const SPIKE_HEIGHT_FRAC = 20 / DESIGN_HEIGHT;
export const SPIKE_COUNT = 20;
export const SPIKE_BG_OVERLAP = 30;

// --- Movement & Physics ---
export const GRAVITY = 1;
export const MIN_JUMP_STRENGTH = 15;
export const MAX_JUMP_STRENGTH = 45;
export const CHARGE_RATE = 1;
export const SPEED = 3;
export const LEVEL_DURATION = 40; // seconds
export const COLLISION_TOLERANCE = 7;

// --- Jump Buffer & Coyote Time ---
export const COYOTE_FRAMES = 3;
export const JUMP_BUFFER_FRAMES = 2;

// --- Joystick Support ---
export const NUDGE_RANGE = 50;
export const NUDGE_SPEED = 0.15;

// --- Bubble Effects ---
export const BUBBLE_MIN_RADIUS = 5;
export const BUBBLE_MAX_RADIUS = 10;
export const BUBBLE_SPEED_MIN = 1;
export const BUBBLE_SPEED_MAX = 3;
export const BUBBLE_SPAWN_RATE = 0.03;
export const BUBBLE_MAX_COUNT = 15;

// --- Colors ---

export const WHITE      = '#FFFFFF';
export const RED        = '#FF0000';
export const BLUE       = '#0000FF';
export const GREEN      = '#00FF00';
export const BLACK      = '#000000';
export const LIGHT_BLUE = '#ADD8E6';

export const SPIKE_COLOR    = 'rgb(255,0,0)';
export const BUBBLE_COLOR   = '#00FF00';
export const SPIKE_BG_COLOR = '#000000';
