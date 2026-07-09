// this needs to be here since state is otherwise not shared between bar instances

import { createState } from 'gnim';

export const waterCooldown = 7200;
export const [waterRemTime, setWaterRemTime] = createState<number>(waterCooldown);
