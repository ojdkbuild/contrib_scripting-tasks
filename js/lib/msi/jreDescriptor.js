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
    "lib/common/map",
    "lib/common/startsWith",
    "lib/io/listDirectory",
    "./collectDirectory",
    "./vendorJavaHome"
], function(map, startsWith, listDirectory, collectDirectory, vendorJavaHome) {
    "use strict";

    function compRefs(compIds) {
        return map(compIds, function(id) {
            return {
                type: "element",
                name: "ComponentRef",
                attributes: {
                    Id: id
                }
            };
        });
    }

    return function(vanillaDesc, props, ibPath) {
        var desc = JSON.parse(JSON.stringify(vanillaDesc));

        var product = desc.elements[1].elements[0];
        product.attributes.Name = props.vendorShort + " OpenJDK JRE " + props.jdkVersion;
        product.attributes.Manufacturer = props.vendor;
        product.attributes.UpgradeCode = props.jreUpdateUid;
        product.attributes.Version = props.productVersion;

        var elems = [];
        var compIds = [];
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
                    var features = [];
                    el.elements.forEach(function(fe) {
                        if ("Feature" === fe.name) {
                            features.push(fe);
                            if ("jdk_env_path" === fe.attributes.Id) {
                                fe.attributes.Description = "Appends '&lt;jre&gt;/bin' to the 'PATH' system environment variable.";
                            }
                            if ("jdk_env_java_home" === fe.attributes.Id) {
                                features.push(vendorJavaHome.feature("jre", props.vendorDirName.toUpperCase()));
                            }
                            if (startsWith(fe.attributes.Id, "jdk_")) {
                                fe.attributes.Id = "jre_" + fe.attributes.Id.substring(4);
                            }
                        }
                    });
                    el.attributes.Id = "jre";
                    el.attributes.Title = "OpenJDK JRE";
                    el.attributes.Description = "OpenJDK JRE files.";
                    el.attributes.Display = "expand";
                    el.elements = features;
                }
                // jre files and feature
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
                    jdkDirEl.attributes.Name = props.jdkNamePrefix + "-" + props.jdkVersion + ".jre";

                    // files
                    var jrePath = ibPath.resolve("jre");
                    var collected = collectDirectory(jrePath, jrePath);
                    compIds = collected.compIds;
                    jdkDirEl.elements = collected.dir.elements;
                }
                if ("Feature" === el.name && "jre" === el.attributes.Id) {
                    var features = el.elements;
                    el.elements = [];
                    compRefs(compIds).forEach(function(ref) {
                        el.elements.push(ref);
                    });
                    features.forEach(function(fe) {
                        el.elements.push(fe);
                    });
                }
            }
        });
        product.elements = elems;

        return desc;
    };

});
