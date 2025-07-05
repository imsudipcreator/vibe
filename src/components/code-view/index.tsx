import Prism from 'prismjs'
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import './code-theme.css'
import { useEffect } from 'react';

interface Props {
    code : string
    lang : string
}

const CodeView=({
    code,
    lang
} : Props)=>{
    useEffect(()=>{
        Prism.highlightAll()
    },[code])
    return (
        <pre className='p-2 bg-transparent border-none rounded-none text-sm'>
            <code className={`language-${lang}`}>
                {code}
            </code>
        </pre>
    )
}

export default CodeView
