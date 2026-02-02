'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'

import {
    getBlogDetailByBlogId,
    getAuthorByBlogId,
    getRelatedArticlesByAuthorId
} from '@/app/lib/supabase/queries'

import AuthorCard from '@/components/AuthorCard/AuthorCard'
import RelatedArticles from '@/components/RelatedArticles/RelatedArticles'
import WeeklyRead from '@/components/WeeklyRead/WeeklyRead'
import ProTip from '@/components/ProTip/ProTip'

import './styles.css'
import Navbar from '@/components/Navbar/Navbar'
import Footer from '@/components/Footer/Footer'
import ArticleCardAuthorInfo from '../../../components/ArticleCardAuthorInfo/ArticleCardAuthorInfo'

export default function ArticlePage() {
    const params = useParams()
    const router = useRouter()

    const [blog, setBlog] = useState(null)
    const [author, setAuthor] = useState(null)
    const [relatedArticles, setRelatedArticles] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadPage() {
            try {
                const blogData = await getBlogDetailByBlogId(params.blogId)

                // Only show published blogs
                if (!blogData?.is_published) {
                    setBlog(null)
                    return
                }

                setBlog(blogData)

                const authorData = await getAuthorByBlogId(params.blogId)
                setAuthor(authorData)

                if (blogData.author_id) {
          const related = await getRelatedArticlesByAuthorId(
            // authorData.id,
            blogData.author_id,
            blogData.blog_id
          )
          setRelatedArticles(related || [])
        }
            } catch (err) {
                console.error('Error loading page:', err)
            } finally {
                setLoading(false)
            }
        }

        loadPage()
    }, [params.blogId])

    // Always redirect to login
    function handleAuthRedirect() {
        router.push('/login')
    }

    function handleAuthorProfile() {
        router.push(`/profile/${author.authorId}`);
    }

    if (loading) return <p className="loading">Loading...</p>
    if (!blog) return <p className="error">Blog not found or unpublished</p>

    return (
        <div>
            <Navbar />
            <div className="article-container">

                <main className="article-main">
                    <ArticleCardAuthorInfo author={author} createdAt={blog.created_at} handleAuthorProfile={handleAuthorProfile}/>

                    {blog.title && (
                        <h1 className="article-title">
                            {blog.title}
                        </h1>
                    )}

                    
                    {blog.cover_image && (
                        <Image
                            src={blog.cover_image}
                            alt={blog.title || 'Blog cover'}
                            width={400}
                            height={200}
                            className="article-cover"
                        />
                    )}

                    {blog.content && (
                        <article
                            className="article-content"
                            dangerouslySetInnerHTML={{
                                __html: blog.content
                            }}
                        />
                    )}

                    <ProTip text={blog.pro_tip || "No Pro Tip!! WORK HARD"} />

                </main>

                <aside className="article-sidebar">
                    {author && (
                        <AuthorCard
                            author={{
                                name: author.name,
                                bio: author.bio,
                                avatar: author.avatar_url
                            }}
                            onFollow={handleAuthRedirect}
                        />
                    )}

                    <RelatedArticles articles={relatedArticles}/>

                    <WeeklyRead
                        text="Get the best design and development articles delivered to your inbox."
                        onSubscribe={handleAuthRedirect}
                    />
                </aside>

            </div>
            <Footer />
        </div>
    )
}