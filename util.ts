import { exec } from "node:child_process";

export const trivyScan = (image: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!image) return reject(new Error("No image provided"));
    const sanitizedImage = escapeShell(image)
    exec(`trivy image --format json ${sanitizedImage}`, (err:Error, stdout:Error, stderr:Error) => {
      if (err) {
        return reject(new Error(`Trivy execution failed: ${stderr || err.message}`));
      }
      try {
        const json = JSON.parse(stdout.toString());
        resolve(json);
      } catch (e:Error | any) {
        reject(new Error(`Failed to parse Trivy output: ${e.message}`));
      }
    });
  });
};


function escapeShell(input: string): string {
  return input.replace(/[^a-zA-Z0-9._/:@-]/g, "");
}
