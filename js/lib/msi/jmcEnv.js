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
        component: function() {
            return {
                type: "element",
                name: "Component",
                attributes: {
                    Id: "comp_jmc_env",
                    Directory: "JMCDIR",
                    Guid: "47092aa5-ba5c-421d-a728-398dfb49025e",
                    KeyPath: "yes"
                },
                elements: [
                    {
                        type: "element",
                        name: "Environment",
                        attributes: {
                            "Id": "env_jmc_env",
                            "Name": "PATH",
                            "Value": "[JMCDIR]",
                            "Action": "set",
                            "Part": "last",
                            "System": "yes"
                        }
                    }
                ]
            };
        },

        feature: function() {
            return {
                type: "element",
                name: "Feature",
                attributes: {
                    Id: "jmc_env",
                    Absent: "allow",
                    AllowAdvertise: "no",
                    Level: "2",
                    Title: "JMC PATH Variable",
                    Description: "Appends '&lt;jdk&gt;/missioncontrol' to the 'PATH' system environment variable."
                },
                "elements": [
                    {
                        "type": "element",
                        "name": "ComponentRef",
                        "attributes": {
                            "Id": "comp_jmc_env"
                        }
                    }
                ]
            };
        }
    };
});
