import { useState, useCallback, type ComponentProps, type ComponentType } from 'react'
import GridLayout from 'react-grid-layout'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import {
  TravelMap,
  GitHubHeatmap,
  TechRadar,
  WritingStats,
  ReadingList,
  ProjectProgress,
  GitHubStars,
  YearGoals,
  CurrentlyPlaying,
  CurrentStatus,
  CoffeeCounter,
} from '../components/dashboard'
import './Home.css'

const COLS = 12
const ROW_HEIGHT = 100

type DashboardLayout = {
  i: string
  x: number
  y: number
  w: number
  h: number
  minW?: number
  minH?: number
  maxW?: number
  maxH?: number
  static?: boolean
  isDraggable?: boolean
  isResizable?: boolean
}

const defaultLayout: DashboardLayout[] = [
  // Row 1: GitHub Heatmap (large) + Travel Map
  { i: 'heatmap', x: 0, y: 0, w: 8, h: 3, minW: 6, minH: 2 },
  { i: 'travel', x: 8, y: 0, w: 4, h: 3, minW: 3, minH: 2 },

  // Row 2: Tech Radar + Year Goals + Reading List
  { i: 'tech', x: 0, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'goals', x: 4, y: 3, w: 4, h: 3, minW: 3, minH: 2 },
  { i: 'reading', x: 8, y: 3, w: 4, h: 3, minW: 3, minH: 2 },

  // Row 3: Projects + Small widgets
  { i: 'projects', x: 0, y: 6, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'writing', x: 4, y: 6, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'stars', x: 6, y: 6, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'playing', x: 8, y: 6, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'status', x: 10, y: 6, w: 2, h: 2, minW: 2, minH: 1 },

  // Row 4: Coffee
  { i: 'coffee', x: 4, y: 8, w: 2, h: 2, minW: 2, minH: 1 },
]

const LAYOUT_KEY = 'dashboard-layout'

function loadLayout(): DashboardLayout[] {
  try {
    const saved = localStorage.getItem(LAYOUT_KEY)
    return saved ? JSON.parse(saved) : defaultLayout
  } catch {
    return defaultLayout
  }
}

const widgetComponents: Record<string, React.ReactNode> = {
  heatmap: <GitHubHeatmap />,
  travel: <TravelMap />,
  tech: <TechRadar />,
  goals: <YearGoals />,
  reading: <ReadingList />,
  projects: <ProjectProgress />,
  writing: <WritingStats />,
  stars: <GitHubStars />,
  playing: <CurrentlyPlaying />,
  status: <CurrentStatus />,
  coffee: <CoffeeCounter />,
}

type LayoutChangeHandler = ComponentProps<typeof GridLayout>['onLayoutChange']
const TypedGridLayout = GridLayout as unknown as ComponentType<any>

export default function Home() {
  const [layout, setLayout] = useState<DashboardLayout[]>(loadLayout)
  const [width, setWidth] = useState(1200)

  const containerRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      const observer = new ResizeObserver((entries) => {
        for (const entry of entries) {
          setWidth(entry.contentRect.width)
        }
      })
      observer.observe(node)
      setWidth(node.offsetWidth)
    }
  }, [])

  const handleLayoutChange: LayoutChangeHandler = (newLayout) => {
    const nextLayout = newLayout.map((item) => ({ ...item })) as DashboardLayout[]
    setLayout(nextLayout)
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(nextLayout))
  }

  const handleResetLayout = () => {
    setLayout(defaultLayout)
    localStorage.removeItem(LAYOUT_KEY)
  }

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header__content">
          <h1 className="dashboard-title">我的仪表板</h1>
          <p className="dashboard-subtitle">拖拽卡片以调整布局</p>
        </div>
        <button
          type="button"
          className="dashboard-reset-btn"
          onClick={handleResetLayout}
        >
          重置布局
        </button>
      </header>

      <div className="dashboard-grid" ref={containerRef}>
        <TypedGridLayout
          className="layout"
          layout={layout}
          cols={COLS}
          rowHeight={ROW_HEIGHT}
          width={width}
          onLayoutChange={handleLayoutChange}
          draggableHandle=".widget-header"
          useCSSTransforms
          compactType="vertical"
          preventCollision={false}
        >
          {layout.map((item) => (
            <div key={item.i} className="dashboard-grid-item">
              {widgetComponents[item.i]}
            </div>
          ))}
        </TypedGridLayout>
      </div>
    </div>
  )
}
