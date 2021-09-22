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
    "lib/common/filter",
    "lib/common/includes",
    "lib/common/listProperties",
    "lib/common/Logger",
    "lib/io/listDirectory",
    "lib/io/readFile",
    "lib/io/writeFile",
    "lib/msi/vendorJavaHome",
    "lib/xml-js/xml2js",
    "lib/xml-js/js2xml"
], function(
        module, filter, includes, listProperties, Logger, // common
        listDirectory, readFile, writeFile, // io
        vendorJavaHome, // msi
        xml2js, js2xml // xml-js
) {
    "use strict";
    var logger = new Logger(module.id);

    return function(xmlFile, out) {
        logger.info("task started");

        var xml = readFile(xmlFile);
        var obj = xml2js(xml);
        logger.info("Vanilla descriptor loaded");

        var product = obj.elements[0].elements[0];
        var elems = [];
        product.elements.forEach(function(el) {
            elems.push(el);
            if ("comment" === el.type) {
                // pass
            } else {
                //if (includes(["Directory", "Feature"], el.name)) {
                //    el.elements = [];
                //}
                if ("Component" === el.name && "comp_env_java_home" === el.attributes.Id) {
                    elems.push(vendorJavaHome.component("OJDKBUILD"));
                }
                if ("Feature" === el.name && "jdk_env_java_home" === el.attributes.Id) {
                    elems.push(vendorJavaHome.feature("OJDKBUILD"));
                }
            }
        });
        product.elements = elems;

        var dumped = js2xml(obj, {
            spaces: 4
        });
        writeFile(out, dumped);

        logger.info("task success");
    };
});
