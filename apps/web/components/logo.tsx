import Image from "next/image"

export function logoDocman() {
  return (
    <div>
      <Image src="/docman.png" width={792} height={757} alt="Docsman logo" />
    </div>
  )
}
