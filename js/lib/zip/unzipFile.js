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
    "../io/copyBytes"
], function(copyBytes) {
    "use strict";

    var Charset = Packages.java.nio.charset.Charset;
    var FileInputStream = Packages.java.io.FileInputStream;
    var FileOutputStream = Packages.java.io.FileOutputStream;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;
    var ZipInputStream = Packages.java.util.zip.ZipInputStream;

    function writeFile(path, is) {
        var os = new FileOutputStream((path.toAbsolutePath()));
        try {
            copyBytes(is, os);
        } finally {
            os.close();
        }
    }

    return function(zipFile) {
        var path = Paths.get(zipFile);
        if (!Files.isRegularFile(path)) {
            throw new Error("Invalid input file specified, path: [" + zipFile.toAbsolutePath() + "]");
        }
        var dir = path.getParent();
        if (null === dir) {
            throw new Error("Invalid parent direcotry, path: [" + zipFile.toAbsolutePath() + "]");
        }

        var is = new FileInputStream(zipFile);
        try {
            var zis = new ZipInputStream(is, Charset.forName("UTF-8"));
            var entry = null;
            while (null !== (entry = zis.getNextEntry())) {
                var path = Paths.get(dir, entry.getName());
                if (Files.exists(path)) {
                    throw new Error("Invalid ZIP entry, path: [" + entry.getName() + "]");
                }
                if (entry.isDirectory()) {
                    Files.createDirectories(path);
                } else {
                    writeFile(path, zis);
                }
                zis.closeEntry();
            }
            zis.close();
        } finally {
            is.close();
        }

    };
});
