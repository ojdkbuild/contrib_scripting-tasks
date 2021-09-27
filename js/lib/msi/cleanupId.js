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

    return function(id) {
        var replaced = id.replace(/\/|\s|-|\./g, "_").toLowerCase();
        while(replaced.length > 67) {
            var parts = replaced.split("_");
            var list = [];
            list.push(parts[0]);
            list.push("_");
            // shortened part placeholder
            list.push("-");
            for (var i = 2; i < parts.length; i++) {
                list.push(parts[i]);
                if (i < parts.length - 1) {
                    list.push("_");
                }
            }
            replaced = list.join("");
        }
        return replaced.replace("-", "_");
    };
});
