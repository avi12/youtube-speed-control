const fs = require("fs");
const AdmZip = require("adm-zip");
const yargs = require("yargs");

const { argv } = yargs(process.argv.slice(2));

const dirZip = "dist_packed";
if (!fs.existsSync(dirZip)) {
  console.log(`No "${dirZip}" directory`);
  process.exit();
}

function getManifest(zip) {
  return JSON.parse(zip.getEntry("manifest.json").getData());
}

function getModifiedManifest(manifest) {
  manifest.manifest_version = 2;
  manifest.browser_action = { ...manifest.action };
  delete manifest.action;
  return manifest;
}

function init() {
  const { version } = JSON.parse(
    fs.readFileSync("package.json", { encoding: "utf-8" }).toString()
  );
  const name = argv.i;
  const zipName = name.replace("{version}", version);

  const zip = new AdmZip(zipName);
  const manifest = getModifiedManifest(getManifest(zip));

  zip.addFile("manifest.json", Buffer.from(JSON.stringify(manifest), "utf-8"));
  zip.writeZip(argv.i.replace("{version}", version + "__adapted_for_firefox"));
}

init();
