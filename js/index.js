let searchType = 'Users'

const fetchGitHubUsers = (event) => {
  event.preventDefault();
  switch (searchType) {
    case 'Users':
      fetch(`https://api.github.com/search/users?q=${event.target.search.value}`)
        .then((res) => res.json())
        .then((data) => userList(data.items))
        .catch((err) => console.log(err))
      break;

    case 'Repos':
      fetch(`https://api.github.com/search/repositories?q=${event.target.search.value}`)
        .then((res) => res.json())
        .then((data) => repos2HTML(data.items))
        .catch((err) => console.log(err))
      break;
  }

}

const userList = (users) => {
  let list = document.getElementById('user-list')
  for (const user of users) {
    list.appendChild(githubUser(user))
  }
}

const githubUser = (user) => {
  let li, div, username, avatar, profileLink;

  li = document.createElement('li')

  div = document.createElement('div')

  username = document.createElement('h1')
  username.innerText = user.login
  username.id = username
  username.addEventListener('click', searchUserRepos)

  avatar = document.createElement('img')
  avatar.src = user.avatar_url

  profileLink = document.createElement('a')
  profileLink.innerText = "Link to profile"
  profileLink.href = user.html_url


  div.appendChild(avatar)
  div.appendChild(username)
  div.appendChild(profileLink)

  li.appendChild(div)

  return li
}

const repos2HTML = (repos) => {
  let list = document.getElementById('repos-list')
  cleanRepoList(list)
  for (const repo of repos) {
    list.appendChild(addRepo2HTML(repo))
  }
}

const cleanRepoList = (node) => {
  let first = node.firstChild;
  while (first) {
    first.remove()
    first = node.firstChild
  }
}

const addRepo2HTML = (repo) => {
  let li = document.createElement('li')
  let div = document.createElement('div')
  let link = document.createElement('a')
  link.href = repo.html_url
  link.textContent = repo.full_name
  div.appendChild(link)
  li.appendChild(div)
  return li
}

const searchUserRepos = (event) => {
  fetch(`https://api.github.com/users/${event.target.innerText}/repos`)
    .then((res) => res.json())
    .then((repos) => repos2HTML(repos))
    .catch((err) => console.log(err))
}

const changeSearch = () => {
  let check = document.getElementById('checkbox')

  let label = document.getElementById('search-type')
  if (check.checked) {
    label.textContent = 'Repos'
  } else {
    label.textContent = 'Users'
  }

  searchType = label.textContent;
}

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('github-form').addEventListener('submit', fetchGitHubUsers)
  document.getElementById('checkbox').addEventListener('click', changeSearch)
})