import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { routes } from '../../app.routes';

interface MenuItem {
  path: string;
  title: string;
  icon?: string;
  children?: MenuItem[];
}

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './layout.component.html',
  styles: ``
})
export default class LayoutComponent implements OnInit {
  isLargeScreen: boolean = false;
  sidebarVisible: boolean = false;
  public menuItems = this.getMainRoutes();

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    const isLg = window.innerWidth >= 992; // Usamos el breakpoint 'lg'
    if (isLg) {
      this.sidebarVisible = true; // La sidebar siempre es visible en pantallas grandes
    } else {
      this.sidebarVisible = false; // Oculta la sidebar en móviles por defecto
    }
    this.isLargeScreen = isLg;
  }

  toggleSidebar(): void {
    this.sidebarVisible = !this.sidebarVisible;
  }

  private getMainRoutes(): MenuItem[] {
    const mainRoute = routes.find(route => route.path === 'main');

    if (!mainRoute || !mainRoute.children) {
      return [];
    }

    return mainRoute.children
      .filter(route => route.path && !route.path.includes(':'))
      .map(route => {
        const menuItem: MenuItem = {
          path: `/main/${route.path}`,
          title: this.formatTitle(route.path!),
          icon: this.getIconForRoute(route.path!)
        };

        // Si la ruta tiene hijos, los agregamos al menuItem
        if (route.children && route.children.length > 0) {
          menuItem.children = route.children
            .filter(child => child.path && !child.path.includes(':'))
            .map(child => ({
              path: `/main/${route.path}/${child.path}`,
              title: this.formatTitle(child.path!),
              icon: this.getIconForRoute(child.path!)
            }));
        }

        return menuItem;
      });
  }

  private formatTitle(path: string): string {
    // Mejora el formateo de títulos con múltiples palabras
    return path
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  private getIconForRoute(path: string): string {
    const iconMap: Record<string, string> = {
      'dashboard': 'layout-dashboard',
      'users': 'users',
      'settings': 'settings',
      'profile': 'user'
    };

    return iconMap[path] || 'circle';
  }
}
