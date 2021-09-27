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
    "lib/io/readFile",
    "lib/io/writeFile",
    "lib/msi/jdkDescriptor",
    "lib/msi/jreDescriptor",
    "lib/xml-js/xml2js",
    "lib/xml-js/js2xml"
], function(
        module, Logger, // common
        readFile, writeFile, // io
        jdkDescriptor, jreDescriptor, // msi
        xml2js, js2xml // xml-js
) {
    "use strict";
    var logger = new Logger(module.id);

    var Paths = Packages.java.nio.file.Paths;

    return function(xmlFile, propsFile, outFile, outFileJre) {
        logger.info("task started");

        var xml = readFile(xmlFile);
        var vanillaDesc = xml2js(xml);
        logger.info("Vanilla descriptor loaded");
        var props = JSON.parse(readFile(propsFile));

        var outFilePath = Paths.get(outFile).toAbsolutePath();
        var ibPath = outFilePath.getParent().getParent();

        var jdkDesc = jdkDescriptor(vanillaDesc, props, ibPath);
        var jdkDescXml = js2xml(jdkDesc, {
            spaces: 4
        });
        writeFile(outFile, jdkDescXml);
        logger.info("JDK descriptor written")

        var jreDesc = jreDescriptor(vanillaDesc, props, ibPath);
        var jreDescXml = js2xml(jreDesc, {
            spaces: 4
        });
        writeFile(outFileJre, jreDescXml);
        logger.info("JRE descriptor written")

        logger.info("task success");
    };
});
