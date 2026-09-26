import React from 'react';
import { NavLink } from 'react-router-dom';
import {
	BarChart3,
	LayoutDashboard,
	Megaphone,
	Tags,
	Users,
	WalletCards,
} from 'lucide-react';

const links = [
	{ to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
	{ to: '/admin/users', label: 'Users', icon: Users },
	{ to: '/admin/categories', label: 'Categories', icon: Tags },
	{ to: '/admin/tips', label: 'Saving Tips', icon: WalletCards },
	{ to: '/admin/announcements', label: 'Announcements', icon: Megaphone },
	{ to: '/admin/statistics', label: 'Statistics', icon: BarChart3 },
];

export const AdminSidebar: React.FC = () => (
	<aside className="hidden min-h-[calc(100vh-4rem)] w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900 p-4 md:flex">
		<nav aria-label="Administration" className="space-y-1">
			{links.map(({ to, label, icon: Icon, end }) => (
				<NavLink
					key={to}
					to={to}
					end={end}
					className={({ isActive }) =>
						`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
							isActive
								? 'bg-brand-600 text-white'
								: 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
						}`
					}
				>
					<Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
					<span>{label}</span>
				</NavLink>
			))}
		</nav>
	</aside>
);
