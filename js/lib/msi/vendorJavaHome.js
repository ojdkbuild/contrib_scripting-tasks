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
], function() {
    "use strict";

    return {
        component: function(vendorPrefix) {
            return {
                type: "element",
                name: "Component",
                attributes: {
                    Id: "comp_env_vendor_java_home",
                    Directory: "INSTALLDIR",
                    Guid: "864e1e33-3f98-4be6-ba0d-7e7ba3eb9c10",
                    KeyPath: "yes"
                },
                elements: [
                    {
                        type: "element",
                        name: "Environment",
                        attributes: {
                            Id: "env_vendor_java_home",
                            Name: vendorPrefix + "_JAVA_HOME",
                            Value: "[INSTALLDIR]",
                            Action: "set",
                            Part: "all",
                            System: "yes"
                        }
                    }
                ]
            };
        },

        feature: function(vendorPrefix) {
            return {
                type: "element",
                name: "Feature",
                attributes: {
                    Id: "jdk_env_vendor_java_home",
                    Absent: "allow",
                    AllowAdvertise: "no",
                    Level: "2",
                    Title: vendorPrefix + "_JAVA_HOME Variable",
                    Description: "Sets '" + vendorPrefix + "_JAVA_HOME' system environment variable."
                },
                "elements": []
            };
        }
    };
});