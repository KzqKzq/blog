import { useState, useCallback } from 'react'
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

const COLS = 6
const ROW_HEIGHT = 140

const defaultLayout = [
  { i: 'heatmap', x: 0, y: 0, w: 4, h: 2, minW: 3, minH: 2 },
  { i: 'travel', x: 4, y: 0, w: 2, h: 2, minW: 2, minH: 2 },
  { i: 'tech', x: 0, y: 2, w: 2, h: 2, minW: 2, minH: 2 },
  { i: 'goals', x: 2, y: 2, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'reading', x: 4, y: 2, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'projects', x: 0, y: 4, w: 2, h: 2, minW: 2, minH: 1 },
  { i: 'writing', x: 2, y: 4, w: 1, h: 1, minW: 1, minH: 1 },
  { i: 'stars', x: 3, y: 4, w: 1, h: 1, minW: 1, minH: 1 },
  { i: 'playing', x: 4, y: 4, w: 1, h: 1, minW: 1, minH: 1 },
  { i: 'status', x: 5, y: 4, w: 1, h: 1, minW: 1, minH: 1 },
  { i: 'coffee', x: 2, y: 5, w: 1, h: 1, minW: 1, minH: 1 },
]

const LAYOUT_KEY = 'dashboard-layout'

function loadLayout() {
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

export default function Home() {
  const [layout, setLayout] = useState(loadLayout)
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

  const handleLayoutChange = (newLayout: typeof layout) => {
    setLayout(newLayout)
    localStorage.setItem(LAYOUT_KEY, JSON.stringify(newLayout))
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
        <GridLayout
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
          {layout.map((item: { i: string }) => (
            <div key={item.i} className="dashboard-grid-item">
              {widgetComponents[item.i]}
            </div>
          ))}
        </GridLayout>
      </div>
    </div>
  )
}
