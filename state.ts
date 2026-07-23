// this needs to be here since state is otherwise not shared between bar instances
import System from 'system';
import { createState } from 'gnim';

export const hideWaterWidget = System.programArgs.includes("--hide-water-widget");

// ticks down twice as fast as expected for some reason
export const waterCooldown = 7200 * 2;
export const [waterRemTime, setWaterRemTime] = createState<number>(waterCooldown);
