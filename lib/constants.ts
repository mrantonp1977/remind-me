export enum CollectionColors {
  sunset = "bg-gradient-to-r from-red-500 to-orange-500",
  poppy = "bg-gradient-to-r from-rose-400 to-red-500",
  rosebud = "bg-gradient-to-r from-violet-500 to-purple-500",
  snowflake = "bg-gradient-to-r from-indigo-400 to-cyan-400",
  candy = "bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500",
  firtree = "bg-gradient-to-r from-emerald-400 to-emerald-900",
  metal = "bg-gradient-to-r from-slate-400 to-slate-900",
  powder = "bg-gradient-to-r from-violet-500 to-pink-200",

}


export type CollectionColor = keyof typeof CollectionColors;