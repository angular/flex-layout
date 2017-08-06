import {Component} from '@angular/core';

@Component({
  moduleId: module.id,
  selector: 'demo-responsive-picture',
  template: `

    <md-card class="card-demo" >
      <md-card-title>Responsive Picture</md-card-title>
      <md-card-subtitle>
        Use the srcset API on an &lt;img&gt; to inject &lt;source&gt; elements within a
        &lt;picture&gt; container.
      </md-card-subtitle>

      <md-card-content>
        <div class="containerX">
          <div fxLayout="row" fxFlex class="coloredContainerX box">
            <picture>
                <img  style="width:auto;"
                      src="https://dummyimage.com/400x200/c7c224/000.png&text=default"
                      srcset.md="https://dummyimage.com/500x200/76c720/fff.png&text=md"
                      srcset.sm="https://dummyimage.com/400x200/b925c7/fff.png&text=sm"
                      srcset.lt-sm="https://dummyimage.com/300x200/c7751e/fff.png&text=lt-sm(1x) 1x,
                      https://dummyimage.com/300x200/f0b16e/fff.png&text=lt-sm(2x) 2x,
                      https://dummyimage.com/300x200/f6ca9a/fff.png&text=lt-sm(3x) 3x"
                      srcset.gt-lg="https://dummyimage.com/700x200/258cc7/fff.png&text=gt-lg" >
            </picture>
          </div>
        </div>
      </md-card-content>
      <md-card-content>
        <pre>
            &lt;picture&gt;
                &lt;img  style="width:auto;"
                      src="https://dummyimage.com/400x200/c7c224/000.png&text=default"
                      srcset.md="https://dummyimage.com/500x200/76c720/fff.png&text=md"
                      srcset.sm="https://dummyimage.com/400x200/b925c7/fff.png&text=sm"
                      srcset.lt-sm="https://dummyimage.com/300x200/c7751e/fff.png&text=lt-sm(1x) 1x,
                      https://dummyimage.com/300x200/f0b16e/fff.png&text=lt-sm(2x) 2x,
                      https://dummyimage.com/300x200/f6ca9a/fff.png&text=lt-sm(3x) 3x"
                      srcset.gt-lg="https://dummyimage.com/700x200/258cc7/fff.png&text=gt-lg" &gt;
            &lt;/picture&gt;
        </pre>
      </md-card-content>

      <md-card-footer style="width:95%">
        <media-query-status></media-query-status>
      </md-card-footer>
    </md-card>
  `
})
export class DemoResponsivePicture  {
}
