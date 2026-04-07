import Image from "next/image";

interface ImageDisplayProps {
  src: string;
  alt?: string;
}

export function ImageDisplay({ src, alt = "Imagem da questao" }: ImageDisplayProps) {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
      <Image
        src={src}
        alt={alt}
        width={1200}
        height={800}
        className="h-auto w-full object-cover"
      />
    </div>
  );
}
