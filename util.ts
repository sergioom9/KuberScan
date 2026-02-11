export const trivyScan = async (image: string): Promise<any> => {
  if (!image) {
    throw new Error("No image provided");
  }

  const sanitizedImage = escapeShell(image);
  
  console.log(`🔍 Starting Trivy scan for: ${sanitizedImage}`);

  const command = new Deno.Command("trivy", {
    args: [
      "image",
      "--format", "json",
      "--quiet",
      "--timeout", "10m",
      sanitizedImage
    ],
    stdout: "piped",
    stderr: "piped",
  });

  const { code, stdout, stderr } = await command.output();

  if (code !== 0) {
    const error = new TextDecoder().decode(stderr);
    throw new Error(`Trivy execution failed: ${error}`);
  }

  const output = new TextDecoder().decode(stdout);
  
  try {
    return JSON.parse(output);
  } catch (e: any) {
    throw new Error(`Failed to parse Trivy output: ${e.message}`);
  }
};

function escapeShell(input: string): string {
  return input.replace(/[^a-zA-Z0-9._/:@-]/g, "");
}