import {Component} from '@angular/core';
import 'rxjs/add/operator/filter';

@Component({
  selector: 'demo-issue-266',
  styleUrls: [ './issue.266.demo.css' ],
  template: `
    <md-card class="card-demo">
      <md-card-title>
        <a href="https://github.com/angular/flex-layout/issues/181" target="_blank">Issue #266</a>
      </md-card-title>
      <md-card-subtitle>Using ngxSplit with Flex-Layout:</md-card-subtitle>
      <md-card-content>
        <div class="night-theme">
          <div fxLayout="row" style="height:500px" ngxSplit="row">
            <div fxFlex="30%" ngxSplitArea class="c1r1" >
              <div class="c1r1_header" >Column #1 - Row #1</div>
              <ul>
                <li>2 Columns: 30% + 70%</li>
                <li>2nd Column: 2 rows</li>
                <li>2nd Column: 50% + 50%</li>
              </ul>
            </div>
            <div class="handle handle-row" ngxSplitHandle>
                <i class="material-icons">&#xE25D;</i>
            </div>
            <div fxFlex="70%" ngxSplitArea>
              <div fxLayout="column" fxFlexFill ngxSplit="column">
                <div fxFlex="50%" ngxSplitArea class="c2r1_body" >
                  <div class="c2r1_header" >Column #2 - Row #1</div>
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
                <div fxFlex="50%" ngxSplitArea class="c2r2" >
                  <div class="c2r2_header" >Column #2 - Row #2</div>
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
      </md-card-content>
    </md-card>
  `
})
export class DemoIssue266 {
}
