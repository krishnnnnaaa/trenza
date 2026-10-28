'use client'
import { Search } from "lucide-react"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { useState, type ChangeEvent, type KeyboardEvent } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Spinner } from "../ui/spinner"

export function SearchBar() {
  const router = useRouter()
  const searchParam = useSearchParams();
  const [query, setQuery] = useState(() => searchParam.get("t") ?? "");
  const [loading, setLoading] = useState(false);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    setLoading(true);
    const trimmedQuery = query.trim();
    router.replace(trimmedQuery ? `/shop?t=${encodeURIComponent(trimmedQuery)}` : "/shop");
    setLoading(false);
  };

  const inputProps = {
    onChange: (event: ChangeEvent<HTMLInputElement>) => setQuery(event.target.value),
    onKeyDown: handleKeyDown,
    value: query,
    placeholder: "Search products, categories, or styles...",
  };

  return (
      <InputGroup className="rounded-sm w-[95%] border sm:py-0 py-6 border-black/10 sm:w-[80%] mx-auto my-4">
        <InputGroupAddon align="inline-start">
          <Search />
        </InputGroupAddon>
        <InputGroupInput {...inputProps} id="search-input" className="hidden sm:block" />
        <InputGroupInput {...inputProps} id="search-input-mobile" className="sm:hidden block" placeholder="Search products..." />
        {loading && <Spinner />}
      </InputGroup>
  )
}
