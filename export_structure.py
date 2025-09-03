import os

# Base paths
base_dir = r"C:\Users\shop\Downloads\nextjs-tailwind-starter-templategbsapriceing\nextjs-tailwind-starter"
src_dir = os.path.join(base_dir, "src")
output_file = os.path.join(base_dir, "src_structure.txt")

def save_src_structure():
    with open(output_file, "w", encoding="utf-8") as out:
        for root, _, files in os.walk(src_dir):
            for file in files:
                file_path = os.path.join(root, file)
                out.write(f"\n{'='*80}\n")
                out.write(f"FILE PATH: {file_path}\n")
                out.write(f"{'='*80}\n")
                
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                except Exception as e:
                    content = f"[Could not read file: {e}]"
                
                out.write(content + "\n")

if __name__ == "__main__":
    save_src_structure()
    print(f"✅ Structure saved to {output_file}")
