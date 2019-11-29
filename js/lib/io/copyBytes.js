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

    var Array = Packages.java.lang.reflect.Array;
    var Byte = Packages.java.lang.Byte;

    return function(is, os) {
        var buf = Array.newInstance(Byte.TYPE, 4096);
        var read = -1;
        while (-1 !== (read = is.read(buf, 0, buf.length))) {
            os.write(buf, 0, read);
        }
    };

});