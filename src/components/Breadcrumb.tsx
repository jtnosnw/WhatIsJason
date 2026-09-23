import { Link } from 'react-router'

interface CrumbItem {
  label: string
  /** React Router path — renders a <Link>. Mutually exclusive with onClick. */
  to?: string
  /** In-page action (e.g. reset quiz phase) — renders a <button>. */
  onClick?: () => void
}

/** Breadcrumb trail. Last item is the current page and is never linked. */
export function Breadcrumb({ items }: { items: CrumbItem[] }) {
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, i) => {
          const isLast = i === items.length - 1
          return (
            <li key={i} className="breadcrumb__item">
              {isLast ? (
                <span aria-current="page">{item.label}</span>
              ) : item.to ? (
                <Link to={item.to} className="breadcrumb__link">{item.label}</Link>
              ) : item.onClick ? (
                <button type="button" className="breadcrumb__link" onClick={item.onClick}>{item.label}</button>
              ) : (
                <span>{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
