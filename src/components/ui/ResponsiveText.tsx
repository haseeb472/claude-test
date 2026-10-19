interface ResponsiveTextProps {
  full: string
  short: string
}

// Renders the short copy on mobile and the full copy from `md` up.
export function ResponsiveText({ full, short }: ResponsiveTextProps) {
  if (full === short) return <>{full}</>

  return (
    <>
      <span className="md:hidden">{short}</span>
      <span className="hidden md:inline">{full}</span>
    </>
  )
}
