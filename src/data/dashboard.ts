// Dashboard mock data

export interface City {
    name: string
    country: string
    lat: number
    lng: number
    year: number
}

export interface Book {
    title: string
    author: string
    cover?: string
    status: 'reading' | 'finished' | 'planned'
}

export interface Goal {
    title: string
    progress: number // 0-100
    icon: string
}

export interface Skill {
    name: string
    level: number // 0-100
    category: 'frontend' | 'backend' | 'tools' | 'other'
}

// 去过的城市
export const visitedCities: City[] = [
    { name: '北京', country: '中国', lat: 39.9, lng: 116.4, year: 2024 },
    { name: '上海', country: '中国', lat: 31.2, lng: 121.5, year: 2024 },
    { name: '深圳', country: '中国', lat: 22.5, lng: 114.1, year: 2023 },
    { name: '杭州', country: '中国', lat: 30.3, lng: 120.2, year: 2024 },
    { name: '成都', country: '中国', lat: 30.7, lng: 104.1, year: 2023 },
    { name: '东京', country: '日本', lat: 35.7, lng: 139.7, year: 2024 },
    { name: '大阪', country: '日本', lat: 34.7, lng: 135.5, year: 2024 },
    { name: '新加坡', country: '新加坡', lat: 1.4, lng: 103.8, year: 2023 },
]

// 阅读书单
export const readingList: Book[] = [
    { title: '原则', author: '瑞·达利欧', status: 'finished' },
    { title: '系统设计面试', author: 'Alex Xu', status: 'finished' },
    { title: '重构', author: 'Martin Fowler', status: 'reading' },
    { title: '设计模式', author: 'GoF', status: 'planned' },
    { title: '代码整洁之道', author: 'Robert Martin', status: 'finished' },
]

// 年度目标
export const yearGoals: Goal[] = [
    { title: '写作 50 篇', progress: 32, icon: '✍️' },
    { title: '开源 3 个项目', progress: 100, icon: '🚀' },
    { title: '读完 12 本书', progress: 75, icon: '📚' },
    { title: '学习 Rust', progress: 45, icon: '🦀' },
]

// 技术栈
export const skills: Skill[] = [
    { name: 'TypeScript', level: 95, category: 'frontend' },
    { name: 'React', level: 92, category: 'frontend' },
    { name: 'Vue', level: 78, category: 'frontend' },
    { name: 'CSS/SCSS', level: 88, category: 'frontend' },
    { name: 'Node.js', level: 82, category: 'backend' },
    { name: 'Python', level: 70, category: 'backend' },
    { name: 'PostgreSQL', level: 65, category: 'backend' },
    { name: 'Git', level: 90, category: 'tools' },
    { name: 'Docker', level: 60, category: 'tools' },
    { name: 'Figma', level: 75, category: 'tools' },
]

// 当前状态
export const currentStatus = {
    status: '🎯 专注工作中',
    activity: '正在构建个人博客仪表板',
    location: '深圳',
    timezone: 'GMT+8',
}

// 咖啡统计
export const coffeeStats = {
    today: 2,
    thisWeek: 12,
    thisMonth: 48,
    favorite: '美式咖啡',
}

// 当前播放
export const currentlyPlaying = {
    track: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    isPlaying: true,
}

// GitHub 用户名
export const githubUsername = 'kzqkzq'
