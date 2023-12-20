import { Component } from '@angular/core';

@Component({
    selector: 'app-sidebar-icon',
    standalone: true,
    imports: [],
    template: `<div
        class="
        relative m-2 flex h-14 w-14
        items-center justify-center
        rounded-md bg-gray-500 text-white shadow-lg
        transition-all hover:bg-gray-600
        md:h-12 md:w-12
        "
    >
        <ng-content></ng-content>
    </div>`,
})
export class SidebarIconComponent {}