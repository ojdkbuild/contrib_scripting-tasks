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
    "./jmcCleanup",
    "./jmcFiles",
    "./jmcEnv",
    "./vendorJavaHome"
], function(jmcCleanup, jmcFiles, jmcEnv, vendorJavaHome) {
    "use strict";

    return function(vanillaDesc, props, ibPath) {
        var desc = JSON.parse(JSON.stringify(vanillaDesc));

        var product = desc.elements[1].elements[0];
        product.attributes.Name = props.vendorShort + " OpenJDK " + props.jdkVersion;
        product.attributes.Manufacturer = props.vendor;
        product.attributes.UpgradeCode = props.jdkUpdateUid;
        product.attributes.Version = props.productVersion;

        var elems = [];
        var jmcCompIds = [];
        product.elements.forEach(function(el) {
            elems.push(el);
            if ("comment" === el.type) {
                // continue
            } else {
                // help link
                if ("Property" === el.name && "ARPHELPLINK" === el.attributes.Id) {
                    el.attributes.Value = props.helpLink;
                }
                // vendor JAVA_HOME
                if ("Component" === el.name && "comp_env_java_home" === el.attributes.Id) {
                    elems.push(vendorJavaHome.component(props.vendorDirName.toUpperCase()));
                }
                if ("Feature" === el.name && "jdk" === el.attributes.Id) {
                    el.attributes.Title = "OpenJDK";
                    el.attributes.Display = "expand";
                    var featuresAndRefs = [];
                    el.elements.forEach(function(fe) {
                        featuresAndRefs.push(fe);
                        if ("Feature" === fe.name && "jdk_env_java_home" === fe.attributes.Id) {
                            featuresAndRefs.push(vendorJavaHome.feature("jdk", props.vendorDirName.toUpperCase()));
                        }
                    });
                    el.elements = featuresAndRefs;
                }
                // install dir
                if ("Directory" === el.name && "TARGETDIR" === el.attributes.Id) {
                    var vendorDirEl = el.elements[0].elements[0];
                    if ("dir_vendor" !== vendorDirEl.attributes.Id) {
                        throw new Error("Incorrect 'dir_vendor' element found, id: [" + vendorDirEl.attributes.Id + "]");
                    }
                    vendorDirEl.attributes.Name = props.vendorDirName;
                    var jdkDirEl = vendorDirEl.elements[0];
                    if ("INSTALLDIR" !== jdkDirEl.attributes.Id) {
                        throw new Error("Incorrect 'INSTALLDIR' element found, id: [" + jdkDirEl.attributes.Id + "]");
                    }
                    jdkDirEl.attributes.Name = props.jdkNamePrefix + "-" + props.jdkVersion;
                }
                // JMC
                if ("Directory" === el.name && "TARGETDIR" === el.attributes.Id) {
                    var jmcDirAndCompIds = jmcFiles.dirAndCompIds(ibPath);
                    var jdkDirEl = el.elements[0].elements[0].elements[0];
                    if ("INSTALLDIR" !== jdkDirEl.attributes.Id) {
                        throw new Error("Incorrect 'INSTALLDIR' element found, id: [" + jdkDirEl.attributes.Id + "]");
                    }
                    jdkDirEl.elements.push(jmcDirAndCompIds.dir);
                    jmcCompIds = jmcDirAndCompIds.compIds;
                }
                if ("Component" === el.name && "comp_registry_jar_cmd" === el.attributes.Id) {
                    elems.push(jmcEnv.component());
                }
                if ("Feature" === el.name && "jdk" === el.attributes.Id) {
                    var jmcFeature = jmcFiles.feature(jmcCompIds);
                    jmcFeature.elements.push(jmcEnv.feature());
                    elems.push(jmcFeature);
                }
            }
        });
        var jmcCleanupElems = jmcCleanup(props.vendorDirName, props.imageName);
        jmcCleanupElems.forEach(function(el) {
            elems.push(el);
        });
        product.elements = elems;

        return desc;
    };

});
