import {Component, Input} from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'watermark',
  styleUrls: ['watermark.component.scss'],
  template: `
    <div [style.background]="backgroundImage">
    </div>
  `,
})
export class WatermarkComponent {
  @Input() title = '@angular/layout';
  @Input() message = 'Layout with FlexBox + CSS Grid';

  constructor(private _sanitizer: DomSanitizer) {
  }

  /* tslint:disable:max-line-length */
  get backgroundImage() {
    const rawSVG = `
       <svg id="diagonalWatermark"
         width="100%" height="100%"
         xmlns="http://www.w3.org/2000/svg"
         xmlns:xlink="http://www.w3.org/1999/xlink" >
          <style type="text/css">
            text {
              fill: currentColor;
              font-family: Avenir, Arial, Helvetica, sans-serif;
              opacity: 0.25;
            }
          </style>
          <defs>
            <pattern id="titlePattern" patternUnits="userSpaceOnUse" width="350" height="150">
              <text y="30" font-size="30" id="title">
               ${this.title}
              </text>
            </pattern>
            <pattern xlink:href="#titlePattern">
              <text y="60" x="0" font-size="16" id="message" width="350" height="150">
                ${this.message}
              </text>
            </pattern>
            <pattern id="combo" xlink:href="#titlePattern" patternTransform="rotate(-30)">
              <use xlink:href="#title"/>
              <use xlink:href="#message"/>
            </pattern>
          </defs>
          	<rect width="100%" height="100%" fill="url(#combo)"/>
        </svg>
    `;
    const bkgrndImageUrl = `data:image/svg+xml;base64,${window.btoa(rawSVG)}`;

    return this._sanitizer.bypassSecurityTrustStyle(`url('${bkgrndImageUrl}') repeat-y`);
  }
}
