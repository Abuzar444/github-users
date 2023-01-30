import React, { useState, useEffect, useContext } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const AppContext = React.createContext()

const rootUrl = 'https://api.github.com';
const requestUrl = 'https://api.github.com/rate_limit'
const userUrl = 'https://api.github.com/users/'

const AppProvider = ({ children }) => {
    const [githubUser, setGithubUser] = useState(mockUser)
    const [repos, setRepos] = useState(mockRepos)
    const [followers, setFollowers] = useState(mockFollowers)
    const [isLoading, setIsLoading] = useState(false)
    const [requests, setRequests] = useState(0)
    const [error, setError] = useState({ show: false, msg: '' })

    const fetchRequests = async () => {
        try {
            const response = await axios(requestUrl)
            const { data } = response
            let { rate: { remaining } } = data
            setRequests(remaining)
            if (remaining === 0) {
                showError(true, 'sorry you exceeded hourly rate limit!')
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const showError = (show = false, msg = '') => {
        setError({ show, msg })
    }

    const searchGithubUser = async (user) => {
        showError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch(error => console.log(error))
        if (response) {
            setGithubUser(response.data)
            const { followers_url, repos_url } = response.data
            //repos
            await Promise.allSettled([
                axios(`${repos_url}?per_page=100`),
                axios(`${followers_url}?per_page=100`),])
                .then((results) => {
                    const [repos, followers] = results
                    const status = 'fulfilled'
                    if (repos.status === status) {
                        setRepos(repos.value.data)
                    }
                    if (followers.status === status) {
                        setFollowers(followers.value.data)
                    }
                })

        } else {
            showError(true, 'there is no user with user name you provided')
        }
        setIsLoading(false)
    }

    return (
        <AppContext.Provider value={{ githubUser, repos, followers, requests, error, searchGithubUser, isLoading }}>
            {children}
        </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
    return useContext(AppContext)
}

export default AppProvider