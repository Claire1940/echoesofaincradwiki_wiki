import {
	CalendarCheck,
	Gamepad2,
	Users,
	MonitorSmartphone,
	Palette,
	BookOpen,
	Swords,
	type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
	key: string // 用于翻译键，如 'release' -> t('nav.release')
	path: string // URL 路径，如 '/release'
	icon: LucideIcon // Lucide 图标组件
	isContentType: boolean // 是否对应 content/ 目录
}

// 导航配置：Echoes of Aincrad（SAO 单机动作 JRPG）8 大内容分类
// 分类来源：0_meta/echoesofaincradwiki_wiki/关键词.json + 实际文章目录
export const NAVIGATION_CONFIG: NavigationItem[] = [
	{ key: 'release', path: '/release', icon: CalendarCheck, isContentType: true },
	{ key: 'demo', path: '/demo', icon: Gamepad2, isContentType: true },
	{ key: 'guide', path: '/guide', icon: BookOpen, isContentType: true },
	{ key: 'platforms', path: '/platforms', icon: MonitorSmartphone, isContentType: true },
	{ key: 'creation', path: '/creation', icon: Palette, isContentType: true },
	{ key: 'multiplayer', path: '/multiplayer', icon: Users, isContentType: true },
	{ key: 'weapons', path: '/weapons', icon: Swords, isContentType: true },
]

// 从配置派生内容类型列表（用于路由和内容加载）
export const CONTENT_TYPES = NAVIGATION_CONFIG.filter((item) => item.isContentType).map(
	(item) => item.path.slice(1),
) // 移除开头的 '/' -> ['release', 'demo', 'guide', ...]

export type ContentType = (typeof CONTENT_TYPES)[number]

// 辅助函数：验证内容类型
export function isValidContentType(type: string): type is ContentType {
	return CONTENT_TYPES.includes(type as ContentType)
}
