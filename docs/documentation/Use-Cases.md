## Use Cases

Below are the use cases address by this Layout library. These will be detailed in a separate design doc (pending). The current implementation, however, provides features/solutions for all listed user cases. 

##### Non-responsive Use Cases:

*  Layout elements in rows
*  Layout elements in columns
*  Nested containers should have isolated layout constraints
*  Adjust container children sizes (flex) based on static percentages
*  Adjust container children sizes (flex) based on static pixel values
*  Adjust container children sizes (flex) based on expressions
*  Adjust alignment of container children based on static/dynamic values
*  Adjust offset of container children based on static/dynamic values
*  Adjust ordering of container children based on static/dynamic values
*  Container children resizing (flex) is dependent upon container layout directions (layout)
*  Changes in Layout directives will update nested Flex children 

##### Responsive API Use Cases:

* Change Detection: `ngOnChanges` due to Layout attribute expressions only trigger for defined activated breakpoints or used as fallback
  *  Input changes are filtered so the default input key is used if the activation key is not defined
  *  Input changes are filtered so only the current activated input change will trigger an update
* Activations: when the mediaQuery becomes active
  *  mq Activation only uses expressions for the activated breakpoint 
  *  mq Activation fallback to use to non-responsive expressions (fallback) if no breakpoint defined
* Subscription notifications: using **MatchMedia** and **MediaMonitor**
  *   ResponsiveActivation internally uses MediaMonitor to subscribe to mediaQuery activation changes
  *  `MediaChange` will contain the current activation information
* Querying: for imperative or template logic 
  *  Components can dependency-inject the MatchMediaObservable and subscribe to all activations. See [Demo Example](https://github.com/angular/flex-layout/blob/master/src/demo-app/app/docs-layout-responsive/responsiveFlexOrder.demo.ts#L59)
* Breakpoint Customization:
  * Custom set of breakpoints can be defined as a Provider
  * Custom breakpoints will override ALL default breakpoints (no merging)
 