/*
 * Copyright 2019, akashche at redhat.com
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

    function trim(st) {
        return st.replace(/^\s*/, "").replace(/\s*$/, '');
    }

    // "opt1 opt2=val2"
    return function(args) {
        var res = {};
        for (var i = 0; i < args.length; i++) {
            var parts = args[i].split("=");
            var key = trim(parts[0]);
            parts.shift();
            var valueStr = parts.join("=");
            var value = valueStr.length > 0 ? valueStr : true;
            res[key] = value;
        }
        return res;
    };

});
