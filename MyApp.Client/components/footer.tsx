
const Footer = () => {
  return (
    <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">

        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 mb-12">
          <div className="text-center lg:text-left space-y-4">
            <h3 className="text-4xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white">
              <a href="https://react-templates.net" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                react templates .net
              </a>
            </h3>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Templates for the next generation of AI-assisted web applications.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="https://react-templates.net/docs"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white transition-all bg-slate-900 rounded-full hover:bg-slate-800 hover:shadow-lg hover:shadow-slate-900/20 focus:ring-4 focus:ring-slate-900/20 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500/20 active:scale-95">
              Read Documentation
            </a>
            <a href="https://github.com/NetCoreTemplates/next-rsc"
              className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-900 transition-all bg-white border border-slate-200 rounded-full hover:bg-slate-50 hover:border-slate-300 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-white dark:hover:border-slate-600 focus:ring-4 focus:ring-slate-200 dark:focus:ring-slate-800 active:scale-95">
              View on GitHub
            </a>
          </div>
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p>&copy; {new Date().getFullYear()} My App. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Privacy Policy</a>
          </div>
        </div>

      </div>
    </footer>
  )
}

export default Footer
