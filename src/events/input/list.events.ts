export class ListEvents {
  when?: WhenEventFilter
  page: number = 1
}

export enum WhenEventFilter {
  All = 1,
  Today,
  Tomorrow,
  ThisWeek,
  NextWeek,
}
