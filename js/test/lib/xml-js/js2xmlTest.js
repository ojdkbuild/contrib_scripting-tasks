/*
 * Copyright 2021, akashche at redhat.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "module",
    "lib/common/Logger",
    "lib/xml-js/js2xml",
    "test/assert"
], function(module, Logger, js2xml, assert) {
    "use strict";
    var logger = new Logger(module.id);

    logger.info("run");

    var xml = js2xml({
        elements: [
            {
                type: "element", 
                name: "foo",
                elements: [
                    {
                        type: "element",
                        name: "bar",
                        attributes: {
                            baz: "boo"
                        },
                        elements: [
                            {
                                type: "text",
                                text: "42"
                            }
                        ]
                    }
                ]
            }
        ]
    });
    assert.equal(xml, "<foo><bar baz=\"boo\">42</bar></foo>");

});
