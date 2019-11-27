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
    "./isArray",
    "./isNil"
], function(isArray, isNil) {
    "use strict";

    return function(list, elem) {
        if (!isArray(list)) throw new Error("Specified collection is not an Array");
        if (isNil(elem)) throw new Error("Specified element is Nil");
        
        for (var i = 0; i < list.length; i++) {
            if (elem === list[i]) {
                return true;
            }
        }

        return false;
    };

});
