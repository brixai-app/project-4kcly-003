"use client"

import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import {
  DayPicker,
  type ClassNames,
  type DayPickerProps,
  type DayPickerDefaultProps,
  type DayProps,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "./"

// react-day-picker v9 no longer exposes DayButton/getDefaultClassNames.
// We reproduce the needed className slots and wrap the internal day button
// via the Components API.

const defaultClassNames: ClassNames = {
  root: "rdp",
  months: "rdp-months",
  month: "rdp-month",
  caption: "rdp-caption",
  caption_label: "rdp-caption_label",
  nav: "rdp-nav",
  nav_button: "rdp-nav_button",
  nav_button_previous: "rdp-nav_button_previous",
  nav_button_next: "rdp-nav_button_next",
  table: "rdp-table",
  head: "rdp-head",
  head_row: "rdp-head_row",
  head_cell: "rdp-head_cell",
  tbody: "rdp-tbody",
  row: "rdp-row",
  // key is `weeknumber` in v9 typings; we still style it but keep a
  // separate alias in our own mapping below.
  weeknumber: "rdp-week_number",
  cell: "rdp-cell",
  day: "rdp-day",
  day_today: "rdp-day_today",
  day_outside: "rdp-day_outside",
  day_disabled: "rdp-day_disabled",
  day_hidden: "rdp-day_hidden",
  day_range_start: "rdp-day_range_start",
  day_range_middle: "rdp-day_range_middle",
  day_range_end: "rdp-day_range_end",
  dropdown: "rdp-dropdown",
  dropdown_month: "rdp-dropdown_month",
  dropdown_year: "rdp-dropdown_year",
}

// Extend the public DayPicker props with our extras. We intersect with the
// default-prop type so TS understands built-ins like `className`,
// `classNames`, `showOutsideDays`, `captionLayout`, `formatters`, etc.
export interface CalendarProps
  extends DayPickerProps,
    DayPickerDefaultProps<any> {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
}

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  // Only valid values for captionLayout in v9 are "buttons" | "dropdown",
  // we default to "buttons" which is closest to the prior "label" behavior.
  captionLayout = "buttons",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-3 [--cell-size:2rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        // v9 exposes formatCaption/formatWeekdayName, etc. We keep defaults
        // unless the caller passes overrides.
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        nav_button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.nav_button_previous
        ),
        nav_button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.nav_button_next
        ),
        caption_label: cn(
          "select-none font-medium",
          captionLayout === "buttons"
            ? "text-sm"
            : "[&>svg]:text-muted-foreground flex h-8 items-center gap-1 rounded-md pl-2 pr-1 text-sm [&>svg]:size-3.5",
          defaultClassNames.caption_label
        ),
        table: cn("w-full border-collapse", defaultClassNames.table),
        head_row: cn("flex", defaultClassNames.head_row),
        head_cell: cn(
          "text-muted-foreground flex-1 select-none rounded-md text-[0.8rem] font-normal",
          defaultClassNames.head_cell
        ),
        row: cn("mt-2 flex w-full", defaultClassNames.row),
        // v9 expects `weeknumber` (no underscore)
        weeknumber: cn(
          "text-muted-foreground select-none text-[0.8rem]",
          defaultClassNames.weeknumber
        ),
        cell: cn(
          "group/day relative aspect-square h-full w-full select-none p-0 text-center [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.cell
        ),
        day_range_start: cn(
          "bg-accent rounded-l-md",
          defaultClassNames.day_range_start
        ),
        day_range_middle: cn(
          "rounded-none",
          defaultClassNames.day_range_middle
        ),
        day_range_end: cn(
          "bg-accent rounded-r-md",
          defaultClassNames.day_range_end
        ),
        day_today: cn(
          "bg-accent text-accent-foreground rounded-md data-[selected=true]:rounded-none",
          defaultClassNames.day_today
        ),
        day_outside: cn(
          "text-muted-foreground aria-selected:text-muted-foreground",
          defaultClassNames.day_outside
        ),
        day_disabled: cn(
          "text-muted-foreground opacity-50",
          defaultClassNames.day_disabled
        ),
        day_hidden: cn("invisible", defaultClassNames.day_hidden),
        ...classNames,
      }}
      components={{
        ...components,
        Root: ({ className: rootClassName, ...rootProps }) => {
          const RootComp = components?.Root
          if (RootComp) {
            return (
              <RootComp
                {...rootProps}
                className={cn("data-slot=calendar", rootClassName)}
              />
            )
          }
          return (
            <div
              data-slot="calendar"
              className={cn(rootClassName)}
              {...(rootProps as React.HTMLAttributes<HTMLDivElement>)}
            />
          )
        },
        Chevron: ({ className: chevronClassName, orientation, ...chevronProps }) => {
          const ChevronComp = components?.Chevron as
            | ((props: any) => JSX.Element)
            | undefined
          if (ChevronComp) {
            return (
              <ChevronComp
                {...chevronProps}
                orientation={orientation}
                className={cn("size-4", chevronClassName)}
              />
            )
          }

          if (orientation === "previous") {
            return (
              <ChevronLeftIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }

          if (orientation === "next") {
            return (
              <ChevronRightIcon
                className={cn("size-4", chevronClassName)}
                {...chevronProps}
              />
            )
          }

          return (
            <ChevronDownIcon
              className={cn("size-4", chevronClassName)}
              {...chevronProps}
            />
          )
        },
        Day: CalendarDayButton,
        WeekNumber: ({ children, ...weekProps }) => {
          const WeekNumberComp = components?.WeekNumber as
            | ((props: any) => JSX.Element)
            | undefined
          if (WeekNumberComp) {
            return <WeekNumberComp {...weekProps}>{children}</WeekNumberComp>
          }
          return (
            <td {...weekProps}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          )
        },
      }}
      {...props}
    />
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayProps) {
  const ref = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.toDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-primary data-[selected-single=true]:text-primary-foreground data-[range-middle=true]:bg-accent data-[range-middle=true]:text-accent-foreground data-[range-start=true]:bg-primary data-[range-start=true]:text-primary-foreground data-[range-end=true]:bg-primary data-[range-end=true]:text-primary-foreground group-data-[focused=true]/day:border-ring group-data-[focused=true]/day:ring-ring/50 flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-normal leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 group-data-[focused=true]/day:ring-[3px] [&>span]:text-xs [&>span]:opacity-70",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }