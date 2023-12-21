import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar-icon',
    standalone: true,
    imports: [],
    template: `<div
        class="
        relative m-2 flex h-14 w-14
        items-center justify-center
        rounded-md border-black bg-white text-black shadow-lg
        transition-all hover:bg-blue-400
        dark:bg-gray-700 dark:text-white dark:hover:bg-blue-400
        md:h-12 md:w-12
        "
    >
        <ng-content></ng-content>
    </div>`,
})
export class SidebarIconComponent {}
