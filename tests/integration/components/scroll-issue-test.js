import { module, test } from "qunit";
import { setupRenderingTest } from "ember-qunit";
import {
  render,
  find,
  clearRender,
  pauseTest,
  getRootElement
} from "@ember/test-helpers";
import hbs from "htmlbars-inline-precompile";

function getScrollPosition(emberTestingContainer) {
  return {
    scrollTop: parseInt(emberTestingContainer.scrollTop),
    scrollLeft: parseInt(emberTestingContainer.scrollLeft)
  };
}
module("Integration | Component | scroll-issue", function(hooks) {
  setupRenderingTest(hooks);

  /*
    Notes: 
  
    <div id="ember-testing-container" style="visibility: visible; position: relative;">
      <div id="ember-testing" class="ember-application">
          //TEST CONTENT
      </div>
    </div>

  */

  test("it resets scroll", async function(assert) {
    var scrollPosition;
    var emberTestingContainer = getRootElement().parentElement;

    await render(hbs`
    {{#each (array 1 2 3 4 5 6 7) as |element|}}
      <div id="box{{element}}"style="height:400px;background:#333;margin-bottom:10px;">
        <p style="font-size:30px;color:#fff">{{element}}</p>
      </div>
    {{/each}}
    `);

    scrollPosition = getScrollPosition(emberTestingContainer);

    assert.equal(
      scrollPosition.scrollLeft,
      0,
      "scrollLeft position is 0 after first render"
    );
    assert.equal(
      scrollPosition.scrollTop,
      0,
      "scrollTop position is 0 after first render"
    );

    let scrollTarget = find("#box7");

    scrollTarget.scrollIntoView();

    scrollPosition = getScrollPosition(emberTestingContainer);

    assert.equal(
      scrollPosition.scrollTop,
      1141,
      "container scrollTop position is 1141 after scrolling element into view"
    );

    clearRender();
    await render(hbs`
      <div></div>
    `);

    scrollPosition = getScrollPosition(emberTestingContainer);

    assert.equal(
      scrollPosition.scrollLeft,
      0,
      "scrollLeft position is 0 after second render"
    );
    assert.equal(
      scrollPosition.scrollTop,
      0,
      "scrollTop position is 0 after second render"
    );

    //Take a visual look here to see scroll not reset in DOM
    //await pauseTest();
  });
});
