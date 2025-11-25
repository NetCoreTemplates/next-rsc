'use client'

import { FC, MouseEvent, ReactNode, useRef, useState, useMemo, ChangeEvent } from "react"
import { Terminal, Copy, Check } from "lucide-react"
import { cn } from "../lib/utils"

interface ShellCommandProps {
    className?: string
    children: ReactNode
}

const ShellCommand: FC<ShellCommandProps> = ({ className, children }) => {
    const [copied, setCopied] = useState(false)
    const commandRef = useRef<HTMLElement>(null)

    async function copy(e: MouseEvent) {
        e.preventDefault()

        // Get the text content from the command element
        const textToCopy = commandRef.current?.textContent || ""

        try {
            // Use modern Clipboard API
            await navigator.clipboard.writeText(textToCopy)

            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            // Fallback for older browsers
            const $el = document.createElement("textarea")
            $el.value = textToCopy
            $el.style.position = "fixed"
            $el.style.opacity = "0"
            document.body.appendChild($el)
            $el.select()
            document.execCommand("copy")
            document.body.removeChild($el)

            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    return (
        <div className={cn(
            "group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700",
            "bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800",
            "shadow-sm hover:shadow-md transition-all duration-200",
            className)}
            onClick={copy}
        >
            {/* Background pattern */}
            <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-50"
                 style={{ backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.05) 1px, transparent 1px)', backgroundSize: '16px 16px' }} />

            <div className="relative flex items-center justify-between px-4 py-3">
                {/* Left side - Terminal icon and command */}
                <div className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer">
                    <Terminal className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0" />
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <code ref={commandRef} className="text-sm font-mono text-slate-900 dark:text-slate-100 truncate">
                            {children}
                        </code>
                    </div>
                </div>

                {/* Right side - Language badge and copy button */}
                <div className="flex items-center gap-2 ml-4">
                    <button
                        onClick={copy}
                        className={cn(
                            "flex items-center justify-center p-2 rounded-md",
                            "transition-all duration-200",
                            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                            copied
                                ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700"
                                : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-400 dark:hover:border-slate-500"
                        )}
                        aria-label={copied ? "Copied!" : "Copy command"}
                    >
                        {copied ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Copy className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}

type Props = {
    template: string
}

export default ({ template }: Props) => {
    let defaultValue = 'MyProject'
    let [project, setProject] = useState(defaultValue)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => setProject(e.target.value);

    const zipUrl = (template: string) =>
        `https://account.servicestack.net/archive/${template}?Name=${project || 'MyApp'}`
    const projectZip = useMemo(() => (project || 'MyApp') + '.zip', [project])

    function validateSafeName(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key.match(/[\W]+/g)) {
            e.preventDefault()
            return false
        }
    }

    return (<div className="flex flex-col max-w-3xl">
        <h4 className="py-6 text-center text-xl">Create New Project</h4>

        <input type="text" onChange={handleChange} defaultValue={defaultValue} autoComplete="off" spellCheck="false" onKeyDown={validateSafeName}
               className="mb-8 sm:text-lg rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 dark:bg-gray-800" />

        <section className="w-full flex justify-center text-center">
            <div className="mb-8">
                <div className="flex justify-center text-center">
                    <a className="archive-url hover:no-underline netcoretemplates_empty" href={zipUrl(`NetCoreTemplates/${template}`)}>
                        <div className="bg-white dark:bg-gray-800 px-4 py-4 mr-4 mb-4 rounded-lg shadow-lg text-center items-center justify-center hover:shadow-2xl dark:border-2 dark:border-pink-600 dark:hover:border-blue-600"
                             style={{ minWidth: '150px' }}>
                            <div className="text-center font-extrabold flex items-center justify-center mb-2">
                                <div className="text-4xl text-blue-400 my-3">
                                    <img className="size-12" src="/assets/img/logo.svg" alt="Next.js"/>
                                </div>
                            </div>
                            <div className="text-xl font-medium text-gray-700 dark:text-gray-300">Next.js</div>
                            <div className="flex justify-center h-8"></div>
                            <span className="archive-name px-4 pb-2 text-blue-600 dark:text-indigo-400">{projectZip}</span>
                            <div className="count mt-1 text-gray-400 text-sm"></div>
                        </div>
                    </a>
                </div>
            </div>
        </section>

        <ShellCommand className="mb-2">npx create-net {template} {project}</ShellCommand>

        <h4 className="py-6 text-center text-xl">Run .NET and Next.js</h4>
        <ShellCommand className="mb-2">dotnet watch</ShellCommand>
    </div>)
}
