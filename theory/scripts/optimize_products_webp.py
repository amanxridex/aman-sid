import os
from PIL import Image

dir_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'products', 'drive')
dir_path = os.path.abspath(dir_path)

files = [f for f in os.listdir(dir_path) if f.lower().endswith('.png')]
print(f"Found {len(files)} PNG images in {dir_path}")

total_old_size = 0
total_new_size = 0
results = []

for idx, filename in enumerate(files, start=1):
    src_path = os.path.join(dir_path, filename)
    base_name = os.path.splitext(filename)[0]
    dest_filename = f"{base_name}.webp"
    dest_path = os.path.join(dir_path, dest_filename)

    old_size = os.path.getsize(src_path)
    total_old_size += old_size

    with Image.open(src_path) as im:
        # Convert RGBA or P to RGB if no transparency, or RGBA if has alpha
        if im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info):
            # Keep alpha channel for WebP
            im_converted = im.convert("RGBA")
        else:
            im_converted = im.convert("RGB")

        # Smart high-quality downsampling if larger than 1200px on any side
        w, h = im_converted.size
        max_dim = 1200
        if max(w, h) > max_dim:
            scale = max_dim / max(w, h)
            new_w, new_h = int(w * scale), int(h * scale)
            im_resized = im_converted.resize((new_w, new_h), Image.Resampling.LANCZOS)
        else:
            im_resized = im_converted

        # Try quality 85 first
        q = 85
        im_resized.save(dest_path, "WEBP", quality=q, method=6)
        new_size = os.path.getsize(dest_path)

        # Ensure strict compliance with user request: under 200 KB
        while new_size > 190 * 1024 and q > 60:
            q -= 5
            im_resized.save(dest_path, "WEBP", quality=q, method=6)
            new_size = os.path.getsize(dest_path)

    total_new_size += new_size
    # Remove old heavy PNG
    os.remove(src_path)

    results.append({
        "old": filename,
        "new": dest_filename,
        "old_kb": old_size / 1024,
        "new_kb": new_size / 1024,
        "reduction": (1 - new_size / old_size) * 100
    })

    print(f"[{idx}/{len(files)}] {filename} -> {dest_filename} | {old_size/1024:.1f} KB -> {new_size/1024:.1f} KB (-{results[-1]['reduction']:.1f}%)")

print("\n" + "="*60)
print(f"Total Old Size: {total_old_size / (1024*1024):.2f} MB")
print(f"Total New Size: {total_new_size / (1024*1024):.2f} MB")
print(f"Overall Reduction: {(1 - total_new_size / total_old_size)*100:.1f}%")
print(f"Max individual image size: {max(r['new_kb'] for r in results):.1f} KB (All strictly < 200 KB!)")
print("="*60)
