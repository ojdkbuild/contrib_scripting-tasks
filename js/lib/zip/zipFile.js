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
    "../common/isNil",
    "../io/copyBytes"
], function(isNil, copyBytes) {
    "use strict";

    var Charset = Packages.java.nio.charset.Charset;
    var FileInputStream = Packages.java.io.FileInputStream;
    var FileOutputStream = Packages.java.io.FileOutputStream;
    var Files = Packages.java.nio.file.Files;
    var Paths = Packages.java.nio.file.Paths;
    var ZipEntry = Packages.java.util.zip.ZipEntry;
    var ZipOutputStream = Packages.java.util.zip.ZipOutputStream;

    return function(file, level) {
        var filePath = Paths.get(file).toAbsolutePath();
        if (!Files.isRegularFile(filePath)) {
            throw new Error("Invalid file specified, path: [" + filePath + "]");
        }
        var dest = Paths.get(file + ".zip");
        if (Files.exists(dest)) {
            throw new Error("Destination ZIP file already exists, path: [" + dest + "]");
        }
        if (isNil(level)) {
            level = 9;
        }

        var os = new FileOutputStream(String(dest.toAbsolutePath()));
        try {
            var zos = new ZipOutputStream(os, Charset.forName("UTF-8"));
            zos.setLevel(level);

            zos.putNextEntry(new ZipEntry(filePath.getFileName()));
            var is = new FileInputStream(String(filePath.toAbsolutePath()));
            try {
                copyBytes(is, zos);
            } finally {
                is.close();
            }
            zos.closeEntry();

            zos.close();
        } finally {
            os.close();
        }

        return String(dest);
    };
});
