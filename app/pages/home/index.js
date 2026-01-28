'use client';
import React, { useCallback, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const HomePage = () => {

    const fetchBlogData = useCallback(async () => {
        try {
            const { data } = await supabase.from('blogs').select('*');

            console.log("data", data);
            // setfirst(data);
        } catch (error) {
            console.log(error, "error");
        }
    }, [])

    useEffect(() => {
        fetchBlogData();
    }, [fetchBlogData])

    return (
        <div>
            Home Page
        </div>
    )
}

export default HomePage
