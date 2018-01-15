import {Component, NgModule} from '@angular/core';
import {ServerModule} from '@angular/platform-server';
import {BrowserModule} from '@angular/platform-browser';
import {FlexLayoutModule} from '@angular/flex-layout';

import {SplitModule} from './splitter/split.module';


@Component({
  selector: 'responsive-app',
  styleUrls: ['./responsive-app.css'],
  template: `
    <div class="night-theme">
      <div fxLayout="row" fxLayout.xs="column" style="height:500px" ngxSplit="row">
        <div fxFlex="30%" ngxSplitArea class="c1r1">
          <div class="c1r1_header">Column #1 - Row #1</div>
          <ul>
            <li>2 Columns: 30% + 70%</li>
            <li>2nd Column: 2 rows</li>
            <li>2nd Column: 50% + 50%</li>
          </ul>
        </div>
        <div class="handle handle-row" ngxSplitHandle>
          <i class="material-icons">&#xE25D;</i>
        </div>
        <div fxFlex.xs="70%" fxFlex.gt-md="50%" fxFlex.lg="60%" ngxSplitArea>
          <div fxLayout="column" fxFlexFill ngxSplit="column">
            <div fxFlex="50%" ngxSplitArea class="c2r1_body">
              <div class="c2r1_header">Column #2 - Row #1</div>
              <h1>Layout Dashboard</h1>
              <p>
                Demonstrate use of ngxSplit with the Flex-Layout API
                and flexbox css layouts.
                <br/><br/>
                Haxx0r ipsum cd ctl-c Starcraft concurrently salt unix baz class bar linux
                January 1, 1970 syn for mutex daemon todo mountain dew recursively. Mainframe
                wannabee machine code hack the mainframe do void python bin big-endian break
                tcp ddos emacs public frack.Over clock headers data private *.* pwned
                fork script kiddies.
              </p>
            </div>
            <div class="handle handle-column" ngxSplitHandle>
              <i class="material-icons">&#xE25D;</i>
            </div>
            <div fxFlex="50%" ngxSplitArea class="c2r2">
              <div class="c2r2_header">Column #2 - Row #2</div>
              <ul>
                <li>List Item #1</li>
                <li>List Item #2</li>
                <li>List Item #3</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResponsiveApp {
}


@NgModule({
  imports: [
    BrowserModule.withServerTransition({appId: 'responsive-app'}),
    FlexLayoutModule,
    SplitModule
  ],
  bootstrap: [ResponsiveApp],
  declarations: [ResponsiveApp],
})
export class ResponsiveAppClientModule {
}


@NgModule({
  imports: [ResponsiveAppClientModule, ServerModule],
  bootstrap: [ResponsiveApp],
})
export class ResponsiveAppServerModule {
}
