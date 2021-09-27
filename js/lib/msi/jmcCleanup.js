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

    function customActionProperty(id, cmd) {
        return {
            type: "element",
            name: "CustomAction",
            attributes: {
                Id: id,
                Property: "WixQuietExec64CmdLine",
                Value: cmd
            },
            elements: []
        };
    }

    function customActionBinaryKey(id) {
        return {
            type: "element",
            name: "CustomAction",
            attributes: {
                Id: id,
                BinaryKey: "WixCA",
                DllEntry: "WixQuietExec64",
                Return: "ignore"
            },
            elements: []
        };
    }

    function customBefore(action, anchor, condition) {
        return {
            type: "element",
            name: "Custom",
            attributes: {
                Action: action,
                Before: anchor
            },
            elements: [
                {
                    type: "text",
                    text: condition
                }
            ]
        };
    }

    function customAfter(action, anchor, condition) {
        return {
            type: "element",
            name: "Custom",
            attributes: {
                Action: action,
                After: anchor
            },
            elements: [
                {
                    type: "text",
                    text: condition
                }
            ]
        };
    }

    return function(vendorDirName, imageName) {
        return [
            customActionProperty("jmc_cleanup_impersonated_misssioncontrol_prop", "&quot;[JMCDIR]install\\local_cleaner.exe&quot; -d &quot;" + vendorDirName + "/" + imageName + "/missioncontrol&quot;"),
            customActionBinaryKey("jmc_cleanup_impersonated_misssioncontrol"),
            customActionProperty("jmc_cleanup_impersonated_image_prop", "&quot;[JMCDIR]install\\local_cleaner.exe&quot; -e -d &quot;" + vendorDirName + "/" + imageName + "&quot;"),
            customActionBinaryKey("jmc_cleanup_impersonated_image"),
            customActionProperty("jmc_cleanup_impersonated_vendor_prop", "&quot;[JMCDIR]install\\local_cleaner.exe&quot; -e -d &quot;" + vendorDirName + "&quot;"),
            customActionBinaryKey("jmc_cleanup_impersonated_vendor"),
            customActionProperty("jmc_cleanup_impersonated_self_prop", "&quot;[SystemFolder]cmd.exe&quot; /c if exist &quot;[JMCDIR]&quot; rd /s /q &quot;[JMCDIR]&quot;"),
            customActionBinaryKey("jmc_cleanup_impersonated_self"),
            {
                type: "element",
                name: "InstallExecuteSequence",
                elements: [
                    customBefore("jmc_cleanup_impersonated_misssioncontrol_prop", "jmc_cleanup_impersonated_misssioncontrol", "!jmc=3 AND REMOVE"),
                    customBefore("jmc_cleanup_impersonated_misssioncontrol", "jmc_cleanup_impersonated_image_prop", "!jmc=3 AND REMOVE"),
                    customBefore("jmc_cleanup_impersonated_image_prop", "jmc_cleanup_impersonated_image", "!jmc=3 AND REMOVE"),
                    customBefore("jmc_cleanup_impersonated_image", "jmc_cleanup_impersonated_vendor_prop", "!jmc=3 AND REMOVE"),
                    customBefore("jmc_cleanup_impersonated_vendor_prop", "jmc_cleanup_impersonated_vendor", "!jmc=3 AND REMOVE"),
                    customBefore("jmc_cleanup_impersonated_vendor", "RemoveFiles", "!jmc=3 AND REMOVE"),
                    customAfter("jmc_cleanup_impersonated_self_prop", "RemoveFiles", "!jmc=3 AND REMOVE"),
                    customAfter("jmc_cleanup_impersonated_self", "jmc_cleanup_impersonated_self_prop", "!jmc=3 AND REMOVE")
                ]
            }
        ]
    };
});
