import { CommonModule } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, NgModule, Renderer2 } from '@angular/core';
import { DomHandler } from 'primeng/dom';

@Directive({
    selector: '[pAnimate]',
    host: {
        '[class.p-animate]': 'true'
    }
})
export class Animate implements AfterViewInit {
    @Input() enterClass: string;

    observer: IntersectionObserver;

    constructor(private host: ElementRef, public el: ElementRef, public renderer: Renderer2) {}

    ngAfterViewInit() {
        this.bindIntersectionObserver();
    }

    bindIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 1.0
        };

        this.observer = new IntersectionObserver((el) => this.isVisible(el), options);
        this.observer.observe(this.host.nativeElement);
    }

    isVisible(element: IntersectionObserverEntry[]) {
        const [intersectionObserverEntry] = element;
        intersectionObserverEntry.isIntersecting ? this.enter() : this.leave();
    }

    enter() {
        this.host.nativeElement.style.visibility = 'visible';
        DomHandler.addClass(this.host.nativeElement, this.enterClass);
    }

    leave() {
        DomHandler.removeClass(this.host.nativeElement, this.enterClass);
        this.host.nativeElement.style.visibility = 'hidden';
    }

    unbindIntersectionObserver() {
        if (this.observer) {
            this.observer.unobserve(this.host.nativeElement);
        }
    }

    ngOnDestroy() {
        this.unbindIntersectionObserver();
    }
}

@NgModule({
    imports: [CommonModule],
    exports: [Animate],
    declarations: [Animate]
})
export class AnimateModule {}